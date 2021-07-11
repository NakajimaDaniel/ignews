

import { render, screen } from '@testing-library/react'
import { debug } from 'console'
import React from 'react'
import Home from '../../pages'


jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

jest.mock('next/dist/client/router')

describe('Home page', () => {

  it('render correctly', () => {

    render(<Home product={{ priceId: 'fake-price-id', amount: '10' }} />)

    expect(screen.getByText('for 10 month')).toBeInTheDocument()
  })

  

})