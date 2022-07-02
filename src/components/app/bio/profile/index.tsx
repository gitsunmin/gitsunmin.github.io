import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import styled from 'styled-components';
import { Github } from '@styled-icons/boxicons-logos/Github';

import Avatar from '@components/UI/Avatar';
import IconGroup from '@components/UI/group/IconGroup';
import { theme } from '@src/styles/theme';

const ProfileCard = styled.div`
  display: flex;
`;

const ProfileContents = styled.div`
  padding-left: ${theme.spacing(4)};
  font-size: ${theme.fontSize(0)};
`;

const StyledSocialIcon = styled.span`
  svg,
  img:hover {
    cursor: pointer;
  }
`;

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
      profileImage: imageSharp(fixed: { originalName: { eq: "profile.png" } }) {
        gatsbyImageData(
          layout: FIXED
          backgroundColor: ""
          formats: NO_CHANGE
          height: 50
          width: 50
          quality: 95
          placeholder: DOMINANT_COLOR
        )
      }
    }
  `);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author;
  const social = data.site.siteMetadata?.social;
  const profileImage = data.profileImage?.gatsbyImageData;

  const contents = author?.name && (
    <>
      <span>
        <strong>{author.name}</strong> | {author?.job ?? null} <br />
        {author?.summary ?? null}
      </span>
      <IconGroup>
        {/* add on other social icon */}
        <StyledSocialIcon>
          <Github
            width={30}
            onClick={() => {
              social.github && window.open(social.github, '_blank');
            }}
          />
        </StyledSocialIcon>
      </IconGroup>
    </>
  );

  return (
    <ProfileCard>
      <Avatar image={profileImage} />
      <ProfileContents>{contents}</ProfileContents>
    </ProfileCard>
  );
};

export default Profile;
