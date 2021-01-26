
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Databarang from '../../Models/Databarang'
import Depo from '../../Models/Depo'
import GudangBarang from '../../Models/GudangBarang'
import Opname from '../../Models/Opname'
import TempKodeBarang from '../../Models/TempKodeBarang'
import { schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'


export default class StockOpnamesController {

  /**
   * start
   */
  public async start({ response, session }: HttpContextContract) {

    await Database
      .rawQuery('INSERT INTO temp_kode_barang(kode_brng) SELECT kode_brng FROM databarang')
    session.flash('start', 'kode barang berhasil diimport')
    return response.redirect('/depo')
  }

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
  public async form({ view, session, response }: HttpContextContract) {


    // let opname = await Opname.findBy('kode_brng', 'B000006151')
    // return opname

    let KodeBarangSession = session.get('kodeBarangSession')
    if (KodeBarangSession == undefined) {
      return response.redirect('/depo')
    }
    let dataBarang = await Databarang.findBy('kode_brng', KodeBarangSession)
    let NamaBarang = dataBarang?.namaBarang
    // let KodeObat:any = KodeBarang?.kode_brng
    let depo = await Depo.all()
    let kodeDepo = depo
    session.put('depo', kodeDepo)


    let depoSession = session.get('depoSession')
    let petugasSession = session.get('petugasSession')

    if (petugasSession == '' || petugasSession == null) {
      session.flash('emptyuser', 'Silahkan isi nama petugas SO')
      return response.redirect('/depo')
    } else if (depoSession === "--PILIH DEPO--" || depoSession == undefined) {
      session.flash('emptydepo', 'Silahkan pilih depo dulu')
      return response.redirect('/depo')
    }




    return view.render('form_input',
      {
        depoSession: depoSession,
        petugasSession: petugasSession,
        namaDepo: session.get('namaDepo'),
        // KodeObat:KodeObat,
        kodeBarangSession: KodeBarangSession,
        namaBarang: NamaBarang,
        tanggal: this.tanggal()
      })
  }


  /**
   * store
   */
  public async store({ request, response, session }: HttpContextContract) {


    //validator
    const validated = await request.validate(
      {
        schema: schema.create(
          {
            qty: schema.number()
          }),
        messages: {
          'qty.required': '⬅ISI REAL'
        }
      })



    //kode barang dari form So
    let kdBarangFromInput = request.input('kode_barang')

    //ambil data dari table databarang
    let barang = await Databarang.findBy('kode_brng', kdBarangFromInput)
    let namabarang = barang?.namaBarang.toString()
    let hBeli: any = barang?.hBeli

    //ambil data dari table temp_kode_barang
    let tempKodeBarang = await TempKodeBarang.findBy('status', 0)
    let nextKodeBarang: any = tempKodeBarang?.kode_brng

    // let tanggal = year + "-" + month + "-" + date
    let tanggal = this.tanggal()

    //ambil data dari table gudang barang
    let gudangbarang = await GudangBarang.findBy('kode_brng', kdBarangFromInput)

    // console.log(gudangbarang)
    let stok: any = gudangbarang?.stok
    let real = validated.qty
    let selisih = real < stok ? stok - real : 0
    let lebih = real > stok ? real - stok : 0
    let nomihilang = selisih !== 0 ? hBeli * selisih : 0
    let nomilebih = lebih !== 0 ? hBeli * lebih : 0

    // console.log(selisih)
    // console.log(gudangbarang)
    // console.log(stok)
    let kodeBangsal = session.get('depoSession')
    console.log(kdBarangFromInput)

    try {

      const opname = new Opname()

      opname.kodeBrng = kdBarangFromInput
      opname.hBeli = hBeli
      opname.tanggal = tanggal
      opname.stok = stok
      opname.real = real
      opname.selisih = selisih
      opname.nomihilang = nomihilang
      opname.lebih = lebih
      opname.nomilebih = nomilebih
      opname.keterangan = session.get('petugasSession')
      opname.kdBangsal = session.get('depoSession')
      opname.noBatch = ''
      opname.noFaktur = ''


      await opname.save()
      await TempKodeBarang.query().where('kode_brng', nextKodeBarang).update({ status: 1 })
      await Database.rawQuery(
        "replace into gudangbarang(kode_brng, kd_bangsal, stok) values (?,?,?)",
        [[kdBarangFromInput], [kodeBangsal], [real]])



      session.put('kodeBarangSession', nextKodeBarang)
      session.flash('success', `${namabarang} berhasil diinput`)
      return response.redirect().back()

    } catch (error) {
      session.flash('failed', `${namabarang} gagal diinput`)
      console.log(error)
      return response.redirect().back()
    }
  }

  /**
   * next
   */
  public async next({ session, response }: HttpContextContract) {
    let tempKodeBarang = await TempKodeBarang.findBy('status', 0)
    let KodeBarang: any = tempKodeBarang?.kode_brng
    await TempKodeBarang.query().where('kode_brng', KodeBarang).update({ status: 1 })

    session.put('kodeBarangSession', KodeBarang)

    response.redirect('/so')

  }

  /**
   * reset
   */
  public async reset({ response, session }: HttpContextContract) {

    try {
      await TempKodeBarang.query().where('status', 1).update({ status: 0 })
      session.flash('resetSuccess', 'Berhasil direset')
      return response.redirect('/so')
    } catch (error) {
      session.flash('resetfailed', 'Gagal direset')
      return response.redirect('/so')
    }

  }
}


