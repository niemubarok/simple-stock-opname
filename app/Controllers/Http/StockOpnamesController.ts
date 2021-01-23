
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Databarang from 'App/Models/Databarang'
import Depo from 'App/Models/Depo'
import GudangBarang from 'App/Models/GudangBarang'
import Opname from 'App/Models/Opname'
import TempKodeBarang from 'App/Models/TempKodeBarang'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class StockOpnamesController {


  /**
   * form
   */
  public async form({ view, session, response }:HttpContextContract) {

    let KodeBarang = await TempKodeBarang.findBy('qty', null)
    let KodeObat = KodeBarang?.kode_brng
    let depo = await Depo.all()
    let kodeDepo = depo
    session.put('depo', kodeDepo)

    let NamaObat = await Databarang.findBy('kode_brng', KodeObat)
    let depoSession = session.get('depoSession')
    let petugasSession = session.get('petugasSession')


    console.log(petugasSession)

    if(petugasSession == '' || petugasSession == null){
      session.flash('emptyuser', 'Silahkan isi nama petugas SO')
      return response.redirect('/depo')
    }else if(depoSession === "--PILIH DEPO--" || depoSession == undefined){
      session.flash('emptydepo', 'Silahkan pilih depo dulu')
      return response.redirect('/depo')
    }

    return view.render('form_input',
    {
      depoSession: depoSession,
      petugasSession:petugasSession,
      namaDepo:session.get('namaDepo'),
      KodeObat:KodeObat,
      NamaObat:NamaObat
    })
  }


  /**
   * store
   */
  public async store({ request, response, session}: HttpContextContract) {


    //validator
    const validated = await request.validate(
      {
        schema: schema.create(
          {
            qty: schema.number()
          }),
          messages:{
            'qty.required' : '<--ISI QTY'
          }
      })


    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    let kdBarang = request.input('kode_obat')

    let barang = await Databarang.findBy('kode_brng', kdBarang)
    let namabarang = barang?.namaBarang.toString()

    let gudangbarang = await GudangBarang.findBy('kode_brng', kdBarang)


    let hBeli = barang?.hBeli
    let tanggal = year + "-" + month + "-" + date
    let stok = gudangbarang?.stok
    let real = validated.qty
    let hasil = stok - real


    let selisih = hasil < 0 ? hasil*-1 : 0
    let lebih = hasil > 0 ? hasil : 0
    let nomihilang = hBeli * selisih
    let nomilebih = hBeli * lebih
    // let keterangan = request.input('kode_depo'),
    // let kdBangsal = request.input('kode_depo')

      console.log(validated)
    const opname = new Opname()

    opname.kodeBrng= request.input('kode_obat')
    opname.hBeli=hBeli
    opname.tanggal=tanggal
    opname.stok=stok
    opname.real=real
    opname.selisih=selisih
    opname.nomihilang=nomihilang
    opname.lebih=lebih
    opname.nomilebih=nomilebih
    opname.keterangan=session.get('petugasSession')
    opname.kdBangsal=session.get('depoSession')
    opname.noBatch=''
    opname.noFaktur=''

    await opname.save()

    if(opname.$isPersisted){
      await TempKodeBarang.query().where('kode_brng', kdBarang).update({qty:real})
      session.flash('success', `${namabarang} berhasil diinput`)
      return response.redirect().back()
    }else{
      session.flash('failed', `${namabarang} gagal diinput`)
      return response.redirect().back()
    }




    // return request.input('kode_depo')
  }
}

 // return {
    //   'kode barang': kdBarang,
    //   'nama barang': nmBarang,
    //   'harga beli': hBeli,
    //   'tanggal': tanggal,
    //   'stok': stok,
    //   'real': real,
    //   'hasil': hasil,
    //   'selisih': selisih,
    //   'lebih': lebih,
    //   'nominal hilang': nomihilang,
    //   'nominal lebih' : nomilebih
    // }



