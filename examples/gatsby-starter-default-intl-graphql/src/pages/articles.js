import React from "react"
import { Link, injectIntl } from "gatsby-plugin-intl-graphql"

import Layout from "../components/layout"

const PageArticles = ({intl:{ messages }}) => (
  <Layout>

    <ul>
      {messages.articles.map(article => (
        <li key={article.id}>
          <h1>{article.content.title}</h1>
          <p>{article.content.description}</p>
        </li>
      ))}
    </ul>
  </Layout>
)

export default injectIntl(PageArticles)