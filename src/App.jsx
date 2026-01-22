import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import * as bootstrap from "bootstrap";

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

  const getproducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(res.data.products);
    } catch (error) {
      console.log(error.response.data.message);
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
      </div>}

      <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true" ref={productModalRef}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className={`modal-header ${modalType === 'delete' ? 'bg-danger' : 'bg-dark'} text-white btn-close-white`}>
              <h5 className="modal-title" id="productModalLabel">{modalType === 'delete' ? '刪除產品' : modalType === 'edit' ?
                '編輯產品' : '新增產品'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">{modalType === 'delete' ? (<p className="fs-4">確定要刪除
              <span className="text-danger">{templateProduct.title}</span>嗎?
            </p>) : (<div className="container">
              <div className="row g-3">
                <div className="col-md-6">
                  <div>
                    <label htmlFor="imageUrl" style={labelStyle}>主圖網址</label>
                    <input type="text" id='imageUrl' placeholder='請輸入圖片網址' name='imageUrl' value={templateProduct.imageUrl} style={inputStyle1} onChange={(e) => handleModalChange(e)} />
                    {templateProduct.imageUrl && (<img className='img-fluid' src={templateProduct.imageUrl} alt="主圖" style={{ marginBottom: '10px', }} />)}
                  </div>

                  {templateProduct.imagesUrl.map((url, index) => {
                    return <div key={index}>
                      <label htmlFor="imagesUrl" style={labelStyle}>更多圖片網址</label>
                      <input type="text" id='imagesUrl' placeholder={`請輸入圖片網址${index + 1}`} name='imagesUrl' value={url} style={inputStyle1} onChange={(e) => handleModalImageChange(index, e.target.value)} />
                      {url && <img className='img-fluid' src={url} alt={`副圖${index + 1}`} style={{ marginBottom: '10px', }} />}
                    </div>
                  })}
                  <div>
                    <button type="button" className="btn btn-outline-primary btn-sm" style={{ marginBottom: '10px', width: '100%' }} onClick={handleAddImage}>新增圖片</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" style={{ width: '100%' }} onClick={handleRemoveImage}>刪除圖片</button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <label htmlFor="title" style={labelStyle}>標題</label>
                    <input type="text" id='title' placeholder='請輸入標題' name='title' value={templateProduct.title} style={inputStyle1} onChange={handleModalChange} />
                  </div>
                  <div>
                    <label htmlFor="content" style={labelStyle}>內容</label>
                    <input type="text" id='content' placeholder='請輸入內容' name='content' value={templateProduct.content} style={inputStyle1} onChange={handleModalChange} />
                  </div>
                  <div>
                    <label htmlFor="category" style={labelStyle}>分類</label>
                    <input type="text" id='category' placeholder='請輸入分類' name='category' value={templateProduct.category} style={{ ...inputStyle2, marginRight: '25px' }} onChange={handleModalChange} />
                    <label htmlFor="unit" style={labelStyle}>單位</label>
                    <input type="text" id='unit' placeholder='請輸入單位' name='unit' value={templateProduct.unit} style={inputStyle2} onChange={handleModalChange} /></div>
                  <div>
                    <label htmlFor="origin_price" style={labelStyle}>原價</label>
                    <input type="text" id='origin_price' placeholder='請輸入原價' name='origin_price' value={templateProduct.origin_price} style={{ ...inputStyle2, marginRight: '25px' }} onChange={handleModalChange} />
                    <label htmlFor="price" style={labelStyle}>售價</label>
                    <input type="text" id='price' placeholder='請輸入售價' name='price' value={templateProduct.price} style={inputStyle2} onChange={handleModalChange} />
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" name='is_enabled' id="courseCheck1" checked={templateProduct.is_enabled} onChange={handleModalChange} />
                    <label className="form-check-label" htmlFor="courseCheck1" >
                      是否啟用
                    </label>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>)}

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => { closeModal() }}>取消</button>
              <button type="button" className="btn btn-outline-primary" onClick={() => updateProduct(templateProduct.id)}>確認</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
