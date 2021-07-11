

import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'

import { SubscribeButton } from '.'
import { FaLessThanEqual } from 'react-icons/fa'



jest.mock('next-auth/client');

jest.mock('next/dist/client/router');

describe('SubscribeButton component', () => {

  it('renders correctly', () => {

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton /> 
    )

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument()
  })

  it('redirect user to sign in when not authenticated', () => {

    const useSessionMocked = mocked(useSession);
    const signInMocked = mocked(signIn);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  });

  it('redirect to posts when user already has a subscription', () => {

    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { 
        user: { 
          name: 'John Doe', 
          email: 'john.doe@example.com' 
        }, 
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires',
      },
      false
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render (
      <SubscribeButton /> 
    )
    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts');
  })


})

