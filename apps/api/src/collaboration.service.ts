import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server } from '@hocuspocus/server';
import { PrismaService } from './prisma.service';
import * as Y from 'yjs';

@Injectable()
export class CollaborationService implements OnModuleInit, OnModuleDestroy {
  private server: Server;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.server = Server.configure({
      port: 3001,
      async onConnect() {
        console.log('New connection to collaboration server');
      },
      // In a real app, you would implement the persistence logic here
      async onLoadDocument(data) {
        console.log(`Loading document: ${data.documentName}`);
        
        // Return a new Y.Doc. 
        // In the future, we will fetch the latest snapshot from the DB here.
        return new Y.Doc();
      },
      async onStoreDocument(data) {
        console.log(`Storing document: ${data.documentName}`);
        // Here we could save the Yjs binary update to the database.
        // const update = Y.encodeStateAsUpdate(data.document);
        // await this.prisma.document.update(...)
      }
    });

    this.server.listen();
    console.log('Collaboration server is listening on port 3001');
  }

  onModuleDestroy() {
    this.server.destroy();
  }
}
