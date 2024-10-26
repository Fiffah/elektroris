import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../db';
import { RowDataPacket } from 'mysql2';

interface Produk extends RowDataPacket {
  id?: number;
  thumbnail: string;
  kategori: string;
  produk: string;
  harga: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID produk diperlukan' });
    }

    try {
      const query = 'DELETE FROM produk WHERE id = ?';
      await db.promise().query(query, [id]);
      return res.status(200).json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Gagal menghapus produk' });
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const { thumbnail, kategori, produk, harga } = req.body as Produk;

    if (!id) {
      return res.status(400).json({ error: 'ID produk diperlukan' });
    }

    try {
      const query = `
        UPDATE produk 
        SET thumbnail = ?, kategori = ?, produk = ?, harga = ?
        WHERE id = ?
      `;
      await db.promise().query(query, [thumbnail, kategori, produk, harga, id]);
      return res.status(200).json({ message: 'Produk berhasil diperbarui' });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Gagal memperbarui produk' });
    }
  }

  if (req.method === 'GET') {
    try {
      const [rows] = await db.promise().query<Produk[]>('SELECT * FROM produk');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Gagal mengambil produk' });
    }
  }

  if (req.method === 'POST') {
    const { thumbnail, kategori, produk, harga } = req.body as Produk;

    try {
      const query = `
        INSERT INTO produk (thumbnail, kategori, produk, harga) 
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await db.promise().query(query, [thumbnail, kategori, produk, harga]);
      return res.status(201).json({ message: 'Produk berhasil ditambahkan', id: (result as any).insertId });
    } catch (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ error: 'Gagal menambahkan produk' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).json({ error: `Method ${req.method} tidak diizinkan` });
}
