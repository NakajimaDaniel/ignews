


import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'


const posts = [
  { slug: 'new-post', title: 'new-title', excerpt: 'post excerpt', updatedAt: 'March 10' }
];

jest.mock('../../services/prismic.ts')

describe('Posts page', () => {

  it('render correctly', () => {

    render(<Posts  posts={posts} />)

    expect(screen.getByText('new-title')).toBeInTheDocument()
  });

  it('loads initial data', async () => {
    
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          { 
            uid: 'new post',
            data: { 
              title: [
                { title: 'heading', text: 'new title' }
              ], 
              content: [
                { type: 'paragraph', text: 'post excerpt' }
              ],
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any)


    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'new post',
            title: 'new title',
            excerpt: 'post excerpt',
            updateAt: '01 de abril de 2021'
          }]
        }
      })
    )
  })

  

})