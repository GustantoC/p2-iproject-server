const { User, MangaUser } = require('../models')
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
          title: manga.attributes.title.en || manga.attributes.title.jp,
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
      next(error)
    }
  }

  static async getDetail(req, res, next) {
    try {
      let { MalId, type } = req.params
      let urlSearch = `https://api.jikan.moe/v3/${type}/${MalId}`
      let dataSearch = await axios({
        method: 'GET',
        url: urlSearch
      })
      dataSearch = dataSearch.data
      let genreList = []
      dataSearch.genres.forEach((genre) => {
        genreList.push(genre.name)
      })
      dataSearch = {
        MalId: dataSearch.mal_id,
        type: type,
        title: dataSearch.title,
        imageUrl: dataSearch.image_url,
        status: dataSearch.status,
        synopsis: dataSearch.synopsis,
        genreList: genreList
      }
      res.status(200).json(dataSearch)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  static async addToBookmark(req, res, next) {
    try {
      let { MalId, type } = req.params
      let urlSearch = `https://api.jikan.moe/v3/${type}/${MalId}`
      let dataSearch = await axios({
        method: 'GET',
        url: urlSearch
      })
      dataSearch = dataSearch.data
      let response = await MangaUser.create({
        UserId: req.user.id,
        MalId: dataSearch.mal_id,
        type: type
      })
      res.status(200).json({ id: response.id, UserId: response.UserId, MalId: response.MalId, status: response.status })
    } catch (error) {
      if (error.isAxiosError) {
        next({ name: "404", message: "Manga/anime not found" })
      } else {
        next(error)
      }
    }
  }
}

module.exports = MangaController