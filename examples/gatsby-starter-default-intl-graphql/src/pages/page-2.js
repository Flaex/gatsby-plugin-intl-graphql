import React from "react"
import { useIntl, Link } from "gatsby-plugin-intl-graphql"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => {
  const intl = useIntl().messages
  return (
    <Layout>
      <SEO title={intl.static.page_two.title} />
      <h1>{intl.static.page_two.head}</h1>
      <p>{intl.static.page_two.description}</p>
      <Link to="/">
        {intl.static.page_two.go_to}
      </Link>
    </Layout>
  )
}

export default SecondPage
