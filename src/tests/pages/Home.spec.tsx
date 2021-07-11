

import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Home, { getStaticProps } from '../../pages'

jest.mock('next/dist/client/router')

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

jest.mock('../../services/stripe.ts')

describe('Home page', () => {

  it('render correctly', () => {

    render(<Home product={{ priceId: 'fake-price-id', amount: '10' }} />)

    expect(screen.getByText('for 10 month')).toBeInTheDocument()
  });

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-id', 
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-id',
            amount: '$10.00'
          }
        }
      })
    )
  })

  

})