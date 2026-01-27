
function ProductModal({ templateProduct, modalType,
    onUpdateProduct, onCloseModal,
    onChange, onImageChange,
    onAddImage, onRemoveImage,
    productModalRef, labelStyle,
    inputStyle1, inputStyle2, uploadImage }) {

    return (
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
                                <div className="mb-3">
                                    <label htmlFor="fileUpload" style={labelStyle} >上傳圖片</label>
                                    <input type="file" name="fileUpload" id="fileUpload" className="form-control" accept=".jpg,.jpeg,.png" onChange={(e) => uploadImage(e)} />
                                </div>
                                <div>
                                    <label htmlFor="imageUrl" style={labelStyle}>輸入圖片網址</label>
                                    <input type="text" id='imageUrl' placeholder='請輸入圖片網址' name='imageUrl' value={templateProduct.imageUrl} style={inputStyle1} onChange={onChange} />
                                    {templateProduct.imageUrl && (<img className='img-fluid' src={templateProduct.imageUrl} alt="主圖" style={{ marginBottom: '10px', }} />)}
                                </div>

                                {templateProduct.imagesUrl.map((url, index) => {
                                    return <div key={index}>
                                        <label htmlFor="imagesUrl" style={labelStyle}>更多圖片網址</label>
                                        <input type="text" id='imagesUrl' placeholder={`請輸入圖片網址${index + 1}`} name='imagesUrl' value={url} style={inputStyle1} onChange={(e) => onImageChange(index, e.target.value)} />
                                        {url && <img className='img-fluid' src={url} alt={`副圖${index + 1}`} style={{ marginBottom: '10px', }} />}
                                    </div>
                                })}
                                <div>
                                    <button type="button" className="btn btn-outline-primary btn-sm" style={{ marginBottom: '10px', width: '100%' }} onClick={onAddImage}>新增圖片</button>
                                    <button type="button" className="btn btn-outline-danger btn-sm" style={{ width: '100%' }} onClick={onRemoveImage}>刪除圖片</button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div>
                                    <label htmlFor="title" style={labelStyle}>標題</label>
                                    <input type="text" id='title' placeholder='請輸入標題' name='title' value={templateProduct.title} style={inputStyle1} onChange={onChange} />
                                </div>
                                <div>
                                    <label htmlFor="content" style={labelStyle}>內容</label>
                                    <input type="text" id='content' placeholder='請輸入內容' name='content' value={templateProduct.content} style={inputStyle1} onChange={onChange} />
                                </div>
                                <div>
                                    <label htmlFor="category" style={labelStyle}>分類</label>
                                    <input type="text" id='category' placeholder='請輸入分類' name='category' value={templateProduct.category} style={{ ...inputStyle2, marginRight: '25px' }} onChange={onChange} />
                                    <label htmlFor="unit" style={labelStyle}>單位</label>
                                    <input type="text" id='unit' placeholder='請輸入單位' name='unit' value={templateProduct.unit} style={inputStyle2} onChange={onChange} /></div>
                                <div>
                                    <label htmlFor="origin_price" style={labelStyle}>原價</label>
                                    <input type="text" id='origin_price' placeholder='請輸入原價' name='origin_price' value={templateProduct.origin_price} style={{ ...inputStyle2, marginRight: '25px' }} onChange={onChange} />
                                    <label htmlFor="price" style={labelStyle}>售價</label>
                                    <input type="text" id='price' placeholder='請輸入售價' name='price' value={templateProduct.price} style={inputStyle2} onChange={onChange} />
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" name='is_enabled' id="courseCheck1" checked={templateProduct.is_enabled} onChange={onChange} />
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
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => { onCloseModal }}>取消</button>
                        <button type="button" className="btn btn-outline-primary" onClick={() => onUpdateProduct(templateProduct.id)}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProductModal