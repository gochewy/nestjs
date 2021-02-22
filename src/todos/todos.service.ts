import { Injectable } from '@nestjs/common';
import client from '../lib/searchClient';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import apolloClient from '../graphql/client';
import { gql } from 'apollo-boost';
import createClient from '../graphql/client';

@Injectable()
export class TodosService {
  getNameOfTodo(): string {
    return 'something';
  }

  async modifyDocument(document) {
    const index = await client.getIndex('todos');
    const op = document.event.op;
    switch (op) {
      case 'INSERT':
        const newTodo = document.event.data.new;
        console.log(document.event.data.new);
        const newDocument = [
          {
            id: newTodo.id,
            title: newTodo.title,
            userId: newTodo.userId,
            status: newTodo.status,
          },
        ];
        await index.addDocuments(newDocument);
        break;
      case 'UPDATE':
        const updatedTodo = document.event.data.new;
        const updatedDocument = [
          {
            id: updatedTodo.id,
            title: updatedTodo.title,
            userId: updatedTodo.userId,
            status: updatedTodo.status,
          },
        ];
        await index.updateDocuments(updatedDocument);
        break;
      case 'DELETE':
        const docId = document.event.data.old.id;
        await index.deleteDocument(docId);
        break;
      default:
        return 'done';
    }
  }
  async search(query, context) {
    const token = context.req.headers.authorization.replace('Bearer ', '');
    const apolloClient = createClient(token);
    apolloClient
      .query({
        query: gql`
          query searchTodo($q: Int!) {
            todos(limit: $q) {
              id
              title
              userId
            }
          }
        `,
        variables: {
          q: 2,
        },
      })
      .then((t) => {
        console.log('results from apollo client', t.data.todos);
      });
    const jwt: JwtPayload = jwtDecode(token);
    console.log(jwt.sub);
    console.log(query);
    const searchResponse = await client.index('todos').search(query, {
      filters: `userId = ${jwt.sub}`,
      attributesToHighlight: ['title'],
    });
    const formatted = (searchResponse.hits || []).map((m) => ({
      id: m.id,
      title: m.title,
      userId: m.userId,
      status: m.status,
    }));
    console.log(formatted);
    return formatted;
  }
}
