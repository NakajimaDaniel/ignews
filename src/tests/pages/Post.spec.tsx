


import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/client'


const post = { 
  slug: 'new-post', 
  title: 'new-title', 
  content: '<p>post content</p>',
  updatedAt: 'March 10' 
};

jest.mock('next-auth/client')
jest.mock('../../services/prismic.ts')

describe('Post page', () => {

  it('render correctly', () => {

    render(<Post post={post} />)

    expect(screen.getByText('new-title')).toBeInTheDocument()
    expect(screen.getByText('post content')).toBeInTheDocument()
  });

  it('redirects user if no subscription is found', async () => {
    
    
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    }as any)

    const response = await getServerSideProps({
      params: {
        slug: 'new post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        }
      })
    )
  })


  it('load initial data', async () => {

    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake subscription'
    }as any)

    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { title: 'heading', text: 'new title' }
          ], 
          content: [
            { type: 'paragraph', text: 'post content' }
          ],
        },
        last_publication_date: '04-01-2021',
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'new post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'new post',
            title: 'new title', 
            content: '<p>post content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )

  })

  

})