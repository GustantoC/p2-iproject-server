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
              status: currStatus
            }
          })
          Manga.bulkCreate(listMangas)
        })
        .catch(({ response }) => {
          console.log(response.data);
        })
      res.status(200).json(listMangas)
    } catch (error) {
      next(error)
    }
  }

  static async insertNewManga(req, res, next) {
    try {
      let { mal_id } = req.body
      let malData = await axios({
        method: 'GET',
        url: `https://api.jikan.moe/v3/manga/${mal_id}`
      })
        .then(({ data }) => {
          let mangaData = malData.data
          let newManga = {
            MalId: mangaData.mal_id,
            title: mangaData.title,
            imageUrl: mangaData.image_url,
            status: mangaData.publishing ? 'ongoing' : 'completed'
          }
          Manga.create(newManga)
        })
        .catch(({ response }) => {
          console.log(response.data);
        })
      res.status(201).json(newMangaId)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = MangaController