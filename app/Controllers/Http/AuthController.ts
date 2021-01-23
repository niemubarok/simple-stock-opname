import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Depo from 'App/Models/Depo'

export default class AuthController {

  /**
   * loginForm
   */
  public async loginForm({view}) {

    let depo = await Depo.all()
    let kodeDepo = depo

    return view.render('auth/login', { depo, kodeDepo})

  }

  /**
   * login
   */
  public async login({request, response, auth, session}:HttpContextContract) {

    const username = request.input('username')
    const password = request.input('password')
    const pilihdepo = request.input('depo')

    await auth.attempt(username, password)

    session.put('depoSession', pilihdepo)

    // console.log(auth.isAuthenticated)
    response.redirect('/so')
  }
}
