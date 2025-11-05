import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL y ANON_KEY deben estar definidos en las variables de entorno',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });
  }

  onModuleInit() {
    this.logger.log('✅ Supabase client inicializado correctamente');
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Helper methods para operaciones comunes
  from(table: string) {
    return this.supabase.from(table);
  }

  get auth() {
    return this.supabase.auth;
  }

  get storage() {
    return this.supabase.storage;
  }
}