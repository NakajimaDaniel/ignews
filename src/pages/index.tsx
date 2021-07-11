
import { GetStaticProps } from 'next'
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string,
    amount: string
  }
}


export default function Home({ product }: HomeProps) {
  return(
    <>
      <Head>
        <title>ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Welcome</span>
          <h1>news about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.svg"></img>
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async() => {

  const price = await stripe.prices.retrieve('price_1Ib72tBtCwvcj5ijFXmNISUk', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      }).format(price.unit_amount / 100)

  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, 

  }
}