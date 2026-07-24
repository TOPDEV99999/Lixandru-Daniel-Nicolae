export interface BaseRepository<T, CreateDto, UpdateDto> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}