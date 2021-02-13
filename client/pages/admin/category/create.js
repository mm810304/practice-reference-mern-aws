import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';

const Quill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.bubble.css';

import { API } from '../../../config';
import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const CreateCategoryPage = ({ user, token }) => {
  const [state, setState] = useState({
    name: '',
    error: '',
    success: '',
    image: '',
    buttonText: 'Create',
  });
  const { name, error, success, image, buttonText } = state;

  const [imageUploadButtonName, setImageUploadButtonName] = useState('Upload Image');
  const [content, setContent] = useState('');

  const onChangeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const contentHandler = (e) => {
    setContent(e);
    setState({ ...state, success: '', error: '' });
  }

  const imageHandler = (e) => {
    let fileInput = false;

    if (e.target.files[0]) {
      fileInput = true;
    }

    console.log(e.target.files[0]);

    setImageUploadButtonName(e.target.files[0].name);

    if (fileInput) {
      Resizer.imageFileResizer(
        e.target.files[0],
        300,
        300,
        'JPEG',
        100,
        0,
        uri => {
          console.log(uri)
          setState({ ...state, image: uri, success: '', error: '' });
        },
        'base64',
        200,
        200
      );
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Creating...'});
    
    try {
      const response = await axios.post(`${API}/category`, { name, content, image }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });

      setState({
        ...state,
        name: '',
        buttonText: 'Create',
        success: `${response.data.name} has been created.`
      });
      setImageUploadButtonName('Upload Image');
      setContent('');
    } catch (error) {
      console.log('category create error');
      setState({
        ...state,
        buttonText: 'Create',
        error: error.response.data.error
      });
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <h1>Create Category</h1>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <label className="text-muted">Name</label>
            <input 
              type="text" 
              className="form-control"
              name="name"
              onChange={onChangeHandler}
              value={name}
              required
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Content</label>
            <Quill 
              value={content}
              onChange={contentHandler}
              theme="bubble"
              placeholder="Write content here..."
              className="pb-5 mb-3"
              style={{ border: '1px solid #666'}}
            />
          </div>
          <div className="form-group">
            <label className="btn btn-outline-secondary">{imageUploadButtonName}
              <input 
                type="file" 
                accept="image/*"
                className="form-control"
                name="image"
                onChange={imageHandler}
                hidden
              />
            </label>
          </div>
          <div>
            <button className="btn btn-outline-warning">{buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAdmin(CreateCategoryPage);