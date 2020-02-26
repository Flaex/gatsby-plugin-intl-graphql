const query = `
{
  articles {
    id
    title
    content_en {
      title
      description
    }
    content_es {
      title
      description
    }
  }
}
`
module.exports = query