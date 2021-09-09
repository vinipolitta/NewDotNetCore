import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
   _filtroLista: any;

   get filtroLista(): string {
    return this._filtroLista;
  }

   set filtroLista(value : string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos
  }

  eventosFiltrados: any = [];

  eventos: any = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtrarPor: any): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );

  }

  getEventos() {
    this.http.get('http://localhost:5000/api/values').subscribe(res => {
      this.eventos = res
      console.log(res);

    },
    error => {
      console.log(error);
    }
    )
  }

}
