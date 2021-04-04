
import { SignInButton } from '../SignInbutton'
import Link from 'next/link'

import styles from './styles.module.scss'
import React from 'react'
import { ActiveLink } from '../activeLink'

export function Header() {

  

  
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg"></img>
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink> 

          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
            <a>Posts</a>
          </ActiveLink> 
          
        </nav>

        <SignInButton/>

      </div>
    </header>
  )
}