import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
   _filtroLista: any;   
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef!: BsModalRef;
  
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
  ) { }

   get filtroLista(): string {
    return this._filtroLista;
  }

   set filtroLista(value : string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos
  }


  ngOnInit() {
    this.getEventos();
  }

  // ALTERNA A IMAGEM PELO BTN
  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  // FILTRA OS EVENTOS PELO INPUT BUSCA
  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template)
  }

  // LISTA DOS EVENTOS VINDO DO BACKEND
  getEventos() {
    this.eventoService.getAllEventos().subscribe((_eventos: Evento[]) => 
      {
        this.eventos = _eventos
        this.eventosFiltrados = this.eventos;
        console.log(_eventos);
      },
      error => {
        console.log(error);
      }
    )
  }
}
