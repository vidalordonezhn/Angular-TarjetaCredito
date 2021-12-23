import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/servives/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {

  form: FormGroup;
  loading = false;
  titulo = 'AGREGAR TARJETA';
  id: string | undefined;

  constructor(private fb: FormBuilder, private _tarjetaService: TarjetaService, private toastr: ToastrService) {
    this.form = fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    })
   }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data => {
      this.id = data.id;
      this.titulo = 'EDITAR TARJETA';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    })
  }

  guardarTarjeta(){
    if(this.id === undefined){
      this.crearTarjeta();
    }else{
      this.editarTarjeta(this.id);
    }
  }

  crearTarjeta(){
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date,
      fechaActualizacion: new Date
    }
    this.loading = true;
    
    this._tarjetaService.guardarTarjeta(TARJETA).then( () => {
      this.loading = false;
      this.toastr.success('La tarjeta se registro correctamente', 'Tarjeta registrada');
      this.form.reset();
    }, error => {
      this.toastr.error('Ops.. ocurrio un error, Intenta nuevamente :)', 'Error');
      console.log(error);
    });
  }

  editarTarjeta(id: string){
    const TARJETA: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date
    }
    this.loading = true;
    this._tarjetaService.editarTarjeta(id, TARJETA).then(()=>{
       this.loading = false;
        this.titulo = "agregar tarjeta",
        this.form.reset();
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con exito', 'Tarjeta Actualizada')
    }, Error => {
      console.log(Error);
    })
  }

}
