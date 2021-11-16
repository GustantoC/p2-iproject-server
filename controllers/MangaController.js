const { User, MangaUser, Manga } = require('../models')
const axios = require('axios')
class MangaController {
  static async topMangas(req, res, next) {
    try {
      let listMangas = []
      await axios({
        method: 'GET',
        url: 'https://api.jikan.moe/v3/top/manga/1/'
      })
        .then(({ data }) => {
          listMangas = data.top
          listMangas = listMangas.map((manga) => {
            let currStatus = 'ongoing'
            if (manga.end_date) {
              currStatus = 'completed'
            }
            return {
              MalId: manga.mal_id,
              title: manga.title,
              imageUrl: manga.image_url,
              status: currStatus,
              score: manga.score
            }
          })

          Manga.bulkCreate(listMangas)
        })
        .catch(({ response }) => {
          console.log(response.data);
        })
      res.status(200).json({ message: "Top 50 manga inserted successfully" })
    } catch (error) {
      next(error)
    }
  }

  static async insertNewManga(req, res, next) {
    try {
      let { mal_id } = req.body
      let resp = await axios({
        method: 'GET',
        url: `https://api.jikan.moe/v3/manga/${Number(mal_id)}`
      })
      let mangaData = resp.data
      let newManga = {
        MalId: mangaData.mal_id,
        title: mangaData.title,
        imageUrl: mangaData.image_url,
        status: mangaData.publishing ? 'ongoing' : 'completed',
        score: mangaData.score
      }
      let insertManga = await Manga.create(newManga)
      res.status(201).json({message: "Manga inserted successfully", mangaDetail: newManga})
    } catch (error) {
      console.log(error)
      if (error.isAxiosError) {
        if(error.response.status == 404){
          error = { name: "404", message: "Manga not found" }
        }
      }
      next(error)
    }
  }
}

module.exports = MangaController