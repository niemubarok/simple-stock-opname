import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Database from '@ioc:Adonis/Lucid/Database'
// import Database from '@ioc:Adonis/Lucid/Database'
import Databarang from 'App/Models/Databarang'

export default class SearchesController {

    /**
     * name
     */
    public async index({ request,view }: HttpContextContract) {

        const inputNamaBarang = request.input('keyword').toString()
        // const replace = inputNamaBarang.replace("''", "")

        const barangs = await Databarang.query().where('nama_brng', 'LIKE', '%' + inputNamaBarang + '%')

        // barang.forEach(el => {
            return view.render('form_input',{barangs})
        // })


        // console.log(replace)
        // console.log(namabarang)
    }
}
