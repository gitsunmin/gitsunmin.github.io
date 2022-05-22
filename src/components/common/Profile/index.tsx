import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"

import Avatar from "@components/common/Profile/Avatar"
import GithubIcon from "@components/icons/GithubIcon"
import SocialNavigation from "@components/common/Profile/SocialNavigation"

const ProfileCard = styled.div({
  display: "flex",
  padding: 10,
})

const ProfileContents = styled.div({
  paddingLeft: 10,
  fontSize: 13,
})

const Profile: React.FC<{}> = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            job
            summary
          }
          social {
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const contents = author?.name && (
    <>
      <span>
        <strong>{author.name}</strong> | {author?.job ?? null} <br />
        {author?.summary ?? null}
      </span>
      <SocialNavigation social={social} />
    </>
  )

  return (
    <ProfileCard>
      <Avatar />
      <ProfileContents>{contents}</ProfileContents>
    </ProfileCard>
  )
}

export default Profile
