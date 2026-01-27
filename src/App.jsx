import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as bootstrap from "bootstrap";
import ProductModal from './component/ProductModal';
import Pagination from './component/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};
//const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;



function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState('');
  const [pagination, setpagination] = useState({});
  const productModalRef = useRef(null);

  const signIn = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `anToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
    } catch (error) {
      console.dir(error.response);
      setIsAuth(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleModalChange = (e) => {
    const { name, value, checked, type } = e.target
    setTemplateProduct((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleModalImageChange = (index, value) => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;
      return {
        ...pre,
        imagesUrl: newImage,
      }
    })
  }

  const handleAddImage = () => {
    setTemplateProduct((pre) => {
      return {
        ...pre,
        imagesUrl: pre.imagesUrl ? [...pre.imagesUrl, ''] : ['']
      }
    })
  }

  const handleRemoveImage = () => {
    setTemplateProduct((pre) => {
      const newImage = [...pre.imagesUrl]
      newImage.pop();
      return {
        ...pre,
        imagesUrl: newImage,
      }
    })
  }

  const getproducts = async (page = 1) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`)
      setProducts(res.data.products);
      setpagination(res.data.pagination)
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }
    try {
      const formData = new FormData()
      formData.append('file-to-upload', file)

      const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData)

      setTemplateProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }))

    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("anToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }

    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    })

    const checkSignIn = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`)

        console.log(res.data);
        setIsAuth(true);
        getproducts();
      } catch (error) {
        console.log(error.response.data.message);

      }
    }

    checkSignIn();

  }, [])

  const updateProduct = async () => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`
    let method = 'post';

    if (modalType === 'edit') {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${templateProduct.id}`
      method = 'put';
    }

    if (modalType === 'delete') {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${templateProduct.id}`
      method = 'delete';
    }

    const productData = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
        imagesUrl: [...templateProduct.imagesUrl.filter((url) => url !== '')],
      }
    }

    try {
      const res = await axios[method](url, productData);
      console.log(res.data);
      getproducts();
      closeModal();
    } catch (error) {
      console.log(error.response);
    }
  }

  const openModal = (type, product) => {
    setModalType(type)
    setTemplateProduct((pre) => ({
      ...pre,
      ...product,
    }));

    productModalRef.current.show();


  }

  const closeModal = () => {
    productModalRef.current.hide();
  }

  const labelStyle = {
    marginRight: '15px',
    fontSize: '16px',
    color: '#333'
  };

  const inputStyle1 = {
    width: '100%',
    padding: '6px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '15px',
    display: 'inline-block'
  };

  const inputStyle2 = {
    width: '205px',
    padding: '6px 12px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '10px',
    display: 'inline-block'
  };

  return (

    <>
      {!isAuth ? <div className='container'>
        <div className="row mt-5 justify-content-center">
          <div className="col-md-4">
            <h3 className='text-center mb-4 '>請先登入</h3>
            <form>
              <div className="card shadow-sm p-4">
                <div className="form-group mb-3">
                  <label htmlFor="username">Email</label>
                  <input type="email" className="form-control"
                    id='username' name="username" placeholder='請輸入信箱' value={formData.username}
                    onChange={handleInputChange} />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">密碼</label>
                  <input type="password" className="form-control"
                    id="password" name="password" placeholder='請輸入密碼' value={formData.password}
                    onChange={handleInputChange} />
                </div>
                <button type='button' className='btn btn-info w-100' onClick={signIn}>登入</button>
              </div>
            </form>
          </div>
        </div>
      </div> : <div className='container'>
        <h2 >產品列表</h2>
        <div className="container">
          {/* 新增產品按鈕 */}
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary" onClick={() => { openModal('create', INITIAL_TEMPLATE_DATA) }} >
              建立新的產品
            </button>
          </div>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>分類</th>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((products) => {
              return <tr key={products.id}>
                <td>{products.category}</td>
                <td>{products.title}</td>
                <td>{products.origin_price}</td>
                <td>{products.price}</td>
                <td className={`${products.is_enabled && 'text-success'}`}>{products.is_enabled ? '已啟用' : '未啟用'}</td>
                <td><div className="btn-group" role="group" aria-label="Basic outlined example">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { openModal('edit', products) }}>編輯</button>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => { openModal('delete', products) }}>刪除</button>
                </div></td>
              </tr>
            })}
          </tbody>
        </table>
        <div className="row mt-5">
          <div className="col-md-6">

          </div>
          {/* <div className="col-md-6">
            <h2>商品明細</h2>
            {templateProduct ? <div className="card">
              <img src={templateProduct.imageUrl} className="card-img-top" alt="商品圖片" />
              <div className="card-body">
                <h5 className="card-title">{templateProduct.title}</h5>
                <p className="card-text">商品描述：{templateProduct.category}</p>
                <p className="card-text">商品內容：{templateProduct.content}</p>
                <p className="card-text">原價：<del>{templateProduct.origin_price} 元</del> / 售價：{templateProduct.price} 元</p>
                {templateProduct.imagesUrl.map((images, index) => {
                  return <img key={index} src={images} class="card-img-top" style={{
                    width: '50%',
                    height: '250px',
                    objectFit: 'cover'
                  }} alt="更多商品圖片" />
                })}
              </div>
            </div> : '請點選商品以查看更多'}
          </div>  */}
        </div>
        <Pagination pagination={pagination} onChangePage={getproducts} />
      </div>}

      <ProductModal
        templateProduct={templateProduct}
        modalType={modalType}
        onCloseModal={closeModal}
        onUpdateProduct={updateProduct}
        onChange={handleModalChange}
        onImageChange={handleModalImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        productModalRef={productModalRef}
        labelStyle={labelStyle}
        inputStyle1={inputStyle1}
        inputStyle2={inputStyle2}
        uploadImage={uploadImage}
      />
    </>
  )
}

export default App
