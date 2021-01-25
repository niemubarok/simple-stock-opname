import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

  /**
   * loginForm
   */
  public async loginForm({view, request}:HttpContextContract) {

    let valuebutton= request.all()

    console.log(valuebutton)
    return view.render('auth/login')

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
