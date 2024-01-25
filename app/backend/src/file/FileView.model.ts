import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'views' })
export class FileView extends Model {
  @PrimaryKey
  @Column
  ip: string;

  @PrimaryKey
  @Column
  filename: string;

  @Column({ defaultValue: 1 })
  view_count: number;
}
