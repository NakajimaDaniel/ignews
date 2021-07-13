


import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { useSession, getSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'


const post = { 
  slug: 'new-post', 
  title: 'new-title', 
  content: '<p>post content</p>',
  updatedAt: 'March 10' 
};

jest.mock('next-auth/client')
jest.mock('next/dist/client/router')
jest.mock('../../services/prismic.ts')

describe('Post page', () => {

  const useSessionMocked = mocked(useSession);

  useSessionMocked.mockReturnValueOnce([null, false])

  it('render correctly', () => {

    render(<Post post={post} />)

    expect(screen.getByText('new-title')).toBeInTheDocument()
    expect(screen.getByText('post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue Reading?')).toBeInTheDocument()
  });

  it('redirects user to full post when user is subscribed', async () => {
    
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-subscription' },
      false
    ]as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/new-post');

  })


  it('load initial data', async () => {

    const getSessionMocked = mocked(getSession);



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

    const response = await getStaticProps({
      params: {
        slug: 'new post'
      }
    })

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