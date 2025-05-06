import React from 'react'
import ferromasLogo from '../img/ferromas_logo.svg';

function home() {
  return (
    <div class="text-center">
        <nav class="navbar bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">
                <img src={ferromasLogo} alt="Logo" width="50" height="50" class="d-inline-block align-text-top"></img>
            </a>
        </div>
        </nav>
    </div>
  )
}

export default home