const { User, MangaUser, Anime } = require('../models')
const axios = require('axios')
const { Op } = require("sequelize");



class MangaController {
  static async getMangaQuery(req, res, next) {
    try {
      let urlSearch = `https://api.mangadex.org/manga?order[followedCount]=desc&contentRating[]=safe&includes[]=cover_art&limit=50`
      let { title } = req.query
      if (title) {
        urlSearch += `&title=${title}&limit=10`
      } else {
        urlSearch += `&limit=50`
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
          status: manga.attributes.status
        }
      })
      res.status(200).json(listMangas)
    } catch (error) {
      next(error)
    }
  }

  static async getAnime(req, res, next) {
    try {
      let { subtype } = req.params
      let { title } = req.query
      subtype = subtype || "airing"
      let urlSearch = `https://api.jikan.moe/v3/top/anime/1/${subtype}`
      if (title) {
        urlSearch = `https://api.jikan.moe/v3/search/anime?q=${title}&limit=10`
      }
      let listAnimes = await axios({
        method: 'GET',
        url: urlSearch
      })
      if (title) {
        listAnimes = listAnimes.data.results
      } else {
        listAnimes = listAnimes.data.top
      }
      listAnimes = listAnimes.map((anime) => {
        return {
          MalId: anime.mal_id,
          title: anime.title,
          imageUrl: anime.image_url
        }
      })
      res.status(200).json(listAnimes)
    } catch (error) {
      if (error.isAxiosError && error.response.status == 503) {
        next({ name: "503", message: "Anime fetching failed please try again later" })
      } else {
        next(error)
      }
    }
  }

  static async getDetail(req, res, next) {
    let detailSend = {}
    try {
      let { type, id } = req.params
      if (type == 'manga') {
        let urlSearch = `https://api.mangadex.org/manga/${id}?includes[]=cover_art`
        let dataSearch = await axios({
          method: 'GET',
          url: urlSearch
        })
        dataSearch = dataSearch.data.data
        let genreList = []
        dataSearch.attributes.tags.forEach((genre) => {
          if (genre.attributes.group == "genre") {
            genreList.push(genre.attributes.name.en)
          }
        })
        let getImageName = dataSearch.relationships.map((rel) => {
          if (rel.type == 'cover_art') {
            return rel.attributes.fileName
          }
        })
        getImageName = getImageName.filter(function (element) {
          return element !== undefined;
        });
        detailSend = {
          id: dataSearch.id,
          type: type,
          title: dataSearch.attributes.title.jp || dataSearch.attributes.title.en,
          imageUrl: `https://uploads.mangadex.org/covers/${dataSearch.id}/${getImageName[0]}`,
          status: dataSearch.attributes.status,
          synopsis: dataSearch.attributes.description.en,
          genreList: genreList
        }
      } else if (type == 'anime') {
        let urlSearch = `https://api.jikan.moe/v3/anime/${id}`
        let getAnime = await axios({
          method: 'GET',
          url: urlSearch
        })
        getAnime = getAnime.data
        let genreList = []
        getAnime.genres.forEach((genre) => {
          genreList.push(genre.name)
        })
        detailSend = {
          id: getAnime.mal_id,
          type: type,
          title: getAnime.title,
          imageUrl: getAnime.image_url,
          status: getAnime.status,
          synopsis: getAnime.synopsis,
          genreList: genreList
        }
      } else {
        throw { name: "400", message: "Undefined type parameter" }
      }
      res.status(200).json(detailSend)
    } catch (error) {
      if (error.isAxiosError) {
        next({ name: "404", message: "Manga/anime not found" })
      } else {
        next(error)
      }
    }
  }
  static async addToMyList(req, res, next) {
    try {
      let { type, id } = req.params
      let UserList = {}
      if (type == 'anime') {
        let urlSearch = `https://api.jikan.moe/v3/anime/${id}`
        let getAnime = await axios({
          method: 'GET',
          url: urlSearch
        })
        getAnime = getAnime.data
        let newAnimeObj = {
          title: getAnime.title,
          imageUrl: getAnime.image_url,
          synopsis: getAnime.synopsis,
          MalId: getAnime.mal_id,
        }
        let insertToDB = await Anime.create(newAnimeObj)
        UserList = {
          UserId: req.user.id,
          DexId: getAnime.mal_id.toString(),
          animeId: insertToDB.id
        }
      } else if (type == 'manga') {
        let urlSearch = `https://api.mangadex.org/manga/${id}`
        let dataSearch = await axios({
          method: 'GET',
          url: urlSearch
        })
        dataSearch = dataSearch.data.data
        UserList = {
          UserId: req.user.id,
          DexId: dataSearch.id,
          animeId: null
        }
      } else {
        throw { name: "400", message: "Undefined type parameter" }
      }
      let response = await MangaUser.create(UserList)

      res.status(200).json({ id: response.id, UserId: response.UserId, DexId: response.DexId, animeId: response.animeId })
    } catch (error) {
      if (error.isAxiosError) {
        next({ name: "404", message: "Manga/anime not found" })
      } else {
        next(error)
      }
    }
  }
  static async getMyList(req, res, next) {
    try {
      let myMangas = []
      let myAnimes = []
      let getAllDexId = await MangaUser.findAll({
        where: {
          UserId: req.user.id,
          animeId: null
        }
      })
      let urlSearch = `https://api.mangadex.org/manga?contentRating[]=safe&includes[]=cover_art&limit=50`
      getAllDexId.forEach((manga) => {
        urlSearch += `&ids[]=${manga.DexId}`
      })
      let resp = await axios({
        method: 'GET',
        url: urlSearch
      })
      myMangas = resp.data.data
      myMangas = myMangas.map((manga) => {
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
          synopsis: manga.attributes.description.en
        }
      })

      let getAllAnimeId = await MangaUser.findAll({
        where: {
          UserId: req.user.id,
          animeId: {
            [Op.not]: null,
          }
        }
      })
      let animeIds = []
      getAllAnimeId.forEach((anime) => {
        animeIds.push(anime.animeId)
      })
      myAnimes = await Anime.findAll({
        where: {
          id: {
            [Op.in]: animeIds
          }
        }
      })
      myAnimes = myAnimes.map((anime) => {
        return {
          id: anime.id,
          MalId: anime.MalId,
          title: anime.title,
          imageUrl: anime.imageUrl,
          synopsis: anime.synopsis
        }
      })
      res.status(200).json({ myMangas: myMangas, myAnimes: myAnimes })
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