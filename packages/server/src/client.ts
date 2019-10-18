import { Client as EventingClient } from '@eventing/core';
import { ClientReads } from './read';
import { ClientWrites } from './write';

export default class Client extends EventingClient<ClientReads, ClientWrites> {}
