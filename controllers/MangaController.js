const { User, MangaUser, Manga } = require('../models')
const axios = require('axios')



class MangaController {
  static async getMangaQuery(req, res, next) {
    try {
      let urlSearch = `https://api.mangadex.org/manga?order[followedCount]=desc&contentRating[]=safe&includes[]=cover_art&limit=50`
      let { title } = req.body
      if (title) {
        urlSearch += `&title=${title}`
      }
      let listMangas = []
      let resp = await axios({
        method: 'GET',
        url: urlSearch
      })
      listMangas = resp.data.data

      listMangas = listMangas.map((manga) => {
        let getImageName = manga.relationships.map((rel) => {
          if (rel.type == 'cover_art') {
            return rel.attributes.fileName
          }
        })
        getImageName = getImageName.filter(function (element) {
          return element !== undefined;
        });
        return {
          id: manga.id,
          title: manga.attributes.title.en,
          imageUrl: `https://uploads.mangadex.org/covers/${manga.id}/${getImageName[0]}`,
          status: manga.attributes.status,
          MalId: Number(manga.attributes.links.mal)
        }
      })
      res.status(200).json(listMangas)
    } catch (error) {
      console.log("ERROR:", error)
      next(error)
    }
  }

  static async getTop50(req, res, next) {
    try {
      let { subtype } = req.params
      subtype = subtype || "airing"
      let urlSearch = `https://api.jikan.moe/v3/top/anime/1/${subtype}`
      let listAnimes = await axios({
        method: 'GET',
        url: urlSearch
      })
      listAnimes = listAnimes.data.top
      listAnimes = listAnimes.map((anime) => {
        return {
          MalId: anime.mal_id,
          title: anime.title,
          imageUrl: anime.image_url,
          score: anime.score
        }
      })
      res.status(200).json(listAnimes)
    } catch (error) {
      console.log("ERROR:", error)
      next(error)
    }
  }

  static async getAnimeDetail(req,res,next) {
    
  }
  static async addToBookmark(req,res,next) {

  }
}

module.exports = MangaController