import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/servives/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas: any[] = [];

  constructor(private _tarjetaService: TarjetaService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.obtenerTarjetas().subscribe(doc => {
      this.listTarjetas = [];
      doc.forEach((element: any) => {
        this.listTarjetas.push({
          id:element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    })
  }

  eliminarTarjeta(id: any){
    this._tarjetaService.eliminarTarjeta(id).then(()=> {
      this.toastr.success('Tarjeta eliminada con exito', 'Registro eliminado');
    }, error => {
      this.toastr.error('Opss.. ocurrio un error', 'Error');
      console.log(error);
    });
  }

  editarTarjeta(tarjeta: TarjetaCredito){
    this._tarjetaService.addTarjetaEdit(tarjeta);
  }

 

}
