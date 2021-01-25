
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Databarang from 'App/Models/Databarang'
import Depo from 'App/Models/Depo'
import GudangBarang from 'App/Models/GudangBarang'
import Opname from 'App/Models/Opname'
import TempKodeBarang from 'App/Models/TempKodeBarang'
import { schema } from '@ioc:Adonis/Core/Validator'


export default class StockOpnamesController {

  public tanggal() {

    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    let tanggal = year + "-" + month + "-" + date

    return tanggal

  }


  /**
   * form
   */
  public async form({ view, session, response }:HttpContextContract) {

    // return this.tanggal()

    // let KodeBarang = await TempKodeBarang.findBy('status', 0)
    // let NamaObat = await Databarang.findBy('kode_brng', KodeObat)
    let KodeBarangSession = session.get('kodeBarangSession')
    let dataBarang = await Databarang.findBy('kode_brng', KodeBarangSession)
    let NamaBarang = dataBarang?.namaBarang
    // let KodeObat:any = KodeBarang?.kode_brng
    let depo = await Depo.all()
    let kodeDepo = depo
    session.put('depo', kodeDepo)


    let depoSession = session.get('depoSession')
    let petugasSession = session.get('petugasSession')

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
      // KodeObat:KodeObat,
      kodeBarangSession:KodeBarangSession,
      namaBarang:NamaBarang,
      tanggal:this.tanggal()
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
            'qty.required' : '⬅ISI REAL'
          }
      })



      //kode barang dari form So
    let kdBarangFromInput = request.input('kode_barang')

      //ambil data dari table databarang
    let barang = await Databarang.findBy('kode_brng', kdBarangFromInput)
    let namabarang = barang?.namaBarang.toString()
    let hBeli:any = barang?.hBeli

    //ambil data dari table temp_kode_barang
    let tempKodeBarang = await TempKodeBarang.findBy('status', 0)
    let nextKodeBarang:any = tempKodeBarang?.kode_brng

    // let tanggal = year + "-" + month + "-" + date
    let tanggal = this.tanggal()

    //ambil data dari table gudang barang
    let gudangbarang = await GudangBarang.findBy('kode_brng', kdBarangFromInput)
    let stok:any = gudangbarang?.stok
    let real = validated.qty


    let selisih = real <= stok ?  stok-real : 0
    let lebih = real >= stok ?  real-stok : 0
    let nomihilang = hBeli * selisih
    let nomilebih = hBeli * lebih

    const opname = new Opname()

    opname.kodeBrng= kdBarangFromInput
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

    try {

      await opname.save()
      await TempKodeBarang.query().where('kode_brng', nextKodeBarang).update({status:1})
      await GudangBarang.query().where('kode_brng', kdBarangFromInput).update({stok:real})
      await GudangBarang.query().where('kode_brng', kdBarangFromInput).update({kd_bangsal:session.get('depoSession')})
      session.put('kodeBarangSession', nextKodeBarang)
      session.flash('success', `${namabarang} berhasil diinput`)
      return response.redirect().back()

    } catch (error) {
      // await TempKodeBarang.query().where('kode_brng', kdBarang).update({status:0})
      session.flash('failed', `${namabarang} gagal diinput`)
      return response.redirect().back()
    }
  }

  /**
   * next
   */
  public async next({session,response}:HttpContextContract) {
    let tempKodeBarang = await TempKodeBarang.findBy('status', 0)
    let KodeBarang:any = tempKodeBarang?.kode_brng
    await TempKodeBarang.query().where('kode_brng', KodeBarang).update({status:1})

    session.put('kodeBarangSession', KodeBarang)

    response.redirect('/so')

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



