class CustomController {
  static async sendData(req, res, next) {
    try {
      res.status(200).json({
        text: `result.id`,
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = CustomController