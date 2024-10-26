"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Produk {
  id?: number;
  thumbnail: string;
  kategori: string;
  produk: string;
  harga: number;
}

export default function AdminPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [newProduk, setNewProduk] = useState<Produk>({
    thumbnail: '',
    kategori: '',
    produk: '',
    harga: 0,
  });

  const [editProduk, setEditProduk] = useState<Produk | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProdukId, setDeleteProdukId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch('/api/produk')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching products: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Produk[]) => setProduk(data))
      .catch((error) => console.error(error.message));
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduk((prevProduk) => ({
      ...prevProduk,
      [name]: name === 'harga' ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduk((prevProduk) => ({
          ...prevProduk,
          thumbnail: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProduk((prevProduk) => {
      if (!prevProduk) return null;
      return {
        ...prevProduk,
        [name]: name === 'harga' ? parseInt(value) : value,
      };
    });
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const addProduk = async () => {
    const response = await fetch('/api/produk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduk),
    });

    if (response.ok) {
      setNewProduk({ thumbnail: '', kategori: '', produk: '', harga: 0 });
      setShowAddModal(false);
      alert('Produk berhasil ditambahkan!');
      window.location.reload();
    } else {
      console.error('Error adding product:', await response.json());
    }
  };

  const openEditModal = (item: Produk) => {
    setEditProduk(item);
    setShowModal(true);
  };

  const saveEdit = async () => {
    if (!editProduk || !editProduk.id) return;

    const response = await fetch(`/api/produk?id=${editProduk.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editProduk),
    });

    if (response.ok) {
      setShowModal(false);
      alert('Data telah diubah');
      setProduk((prev) =>
        prev.map((item) => (item.id === editProduk.id ? editProduk : item))
      );
    } else {
      const errorData = await response.json();
      console.error('Error updating product:', errorData);
      alert(`Gagal mengubah data: ${errorData.error}`);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteProdukId(id);
    setShowDeleteModal(true);
  };

  const deleteProduk = async () => {
    if (!deleteProdukId) return;

    const response = await fetch(`/api/produk?id=${deleteProdukId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Data Berhasil Dihapus');
      setProduk((prev) => prev.filter((item) => item.id !== deleteProdukId));
    } else {
      const errorData = await response.json();
      console.error('Error deleting product:', errorData);
      alert(`Gagal menghapus data: ${errorData.error}`);
    }

    setShowDeleteModal(false);
    setDeleteProdukId(null);
  };

  // Fungsi untuk navigasi ke dashboard
  const goToDashboard = () => {
    router.push('/');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
        <button
          onClick={goToDashboard}
          className="w-full bg-gray-700 text-white p-2 rounded mb-2"
        >
          Kembali ke Dashboard
        </button>
        <button
          onClick={openAddModal}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Tambah Produk
        </button>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Admin Produk</h1>

        <h2 className="text-xl font-semibold mb-4 text-black">Daftar Produk</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg text-black">
            <thead>
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Thumbnail</th>
                <th className="px-4 py-2 border">Produk</th>
                <th className="px-4 py-2 border">Kategori</th>
                <th className="px-4 py-2 border">Harga</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
            {produk.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {item.thumbnail.startsWith('data:image') ? (
                      <img
                        src={item.thumbnail}
                        alt={item.produk}
                        className="w-16 h-16 object-cover "
                      />
                    ) : (
                      <p>Tidak ada gambar</p>
                    )}
                  </td>
                  <td className="px-4 py-2 border">{item.produk}</td>
                  <td className="px-4 py-2 border">{item.kategori}</td>
                  <td className="px-4 py-2 border">Rp. {item.harga.toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => openDeleteModal(item.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Tambah Produk */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
              <div className="mb-4">
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <input
                  type="text"
                  name="kategori"
                  placeholder="Kategori"
                  value={newProduk.kategori}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <input
                  type="text"
                  name="produk"
                  placeholder="Produk"
                  value={newProduk.produk}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <input
                  type="number"
                  name="harga"
                  placeholder="Harga"
                  value={newProduk.harga}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <div className="flex justify-end">
                  <button
                    onClick={addProduk}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Tambah
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit Produk */}
        {showModal && editProduk && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/2">
              <h2 className="text-xl font-semibold mb-4">Edit Produk</h2>
              <div className="mb-4">
                <input
                  type="text"
                  name="thumbnail"
                  placeholder="Thumbnail"
                  value={editProduk.thumbnail}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <input
                  type="text"
                  name="kategori"
                  placeholder="Kategori"
                  value={editProduk.kategori}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <input
                  type="text"
                  name="produk"
                  placeholder="Produk"
                  value={editProduk.produk}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <input
                  type="number"
                  name="harga"
                  placeholder="Harga"
                  value={editProduk.harga}
                  onChange={handleEditInputChange}
                  className="border p-2 w-full mb-2 text-black"
                />
                <div className="flex justify-end">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Delete */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Hapus Produk</h2>
              <p className="mb-4">Anda yakin ingin menghapus produk ini?</p>
              <div className="flex justify-end">
                <button
                  onClick={deleteProduk}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
