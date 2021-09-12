import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import {  BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';
   _filtroLista: any;   
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento!: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm!: FormGroup
  modoSalvar = 'post'
  bodyDeletarEvento = '';
  dataEvento: any;
  file: File[] = [];
  
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private bsLocaleService: BsLocaleService,
    private toastr: ToastrService
  ) { 
    this.bsLocaleService.use('pt-br')
  }

   get filtroLista(): string {
    return this._filtroLista;
  }

   set filtroLista(value : string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos
  }


  ngOnInit() {
    this.validation();
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

  // ABRE OS MODAIS
  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post'
    this.openModal(template);
  }

  editarEvento(evento: Evento, template: any) {
    console.log(evento, template);

    this.modoSalvar = 'put'
    this.openModal(template);
    this.evento = Object.assign({}, evento) ;
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso!');
        }, error => {
          console.log(error);
          this.toastr.error(`Erro ao Deletar: ${error}`);
        }
    );
  }

  // LISTA DOS EVENTOS VINDO DO BACKEND
  getEventos() {
    this.eventoService.getAllEventos().subscribe((_eventos: Evento[]) => 
      {
        this.eventos = _eventos
        this.eventosFiltrados = this.eventos;
      },
      error => {
        console.log(error);
        this.toastr.error(`Erro ao tentar carregar eventos: ${error}`);

      }
    )
  }

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', [Validators.required, Validators.minLength(4)]],
      dataEvento: ['', Validators.required],
      qntdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required]
    })
  }

  uploadImagem() {
    const nomeArquivo = this.evento.imagemURL.split('\\', 3);
    this.evento.imagemURL = nomeArquivo[2];
    this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe();
  }
  
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {        
        this.evento = Object.assign({}, this.registerForm.value);
        this.uploadImagem();    

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao Inserir: ${error}`);
          }
        );
      } else {
        this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
        this.uploadImagem();
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao Editar: ${error}`);
          }
        );
      }
    }
  }

    onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  
}
