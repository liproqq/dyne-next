import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService } from 'services';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.userValue) {
      router.push('/');
    }
  }, []);

  // form validation rules 
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    password: Yup.string().required('Password is required'),
    steam: Yup.string().url().required('Name is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ name, password, steam }) {
    return userService.register(name, password, steam)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
      })
      .catch(error => {
        setError('apiError', { message: error });
      });
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card">
        <h4 className="card-header">Register at Dyne</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="form-group">
              <label>Steam</label>
              <input name="steam" type="steam" {...register('steam')} className={`form-control ${errors.steam ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.steam?.message}</div>
            </div>
            <button disabled={formState.isSubmitting} className="btn btn-primary">
              {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Register
            </button>
            {errors.apiError &&
              <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>
            }
          </form>
        </div>
      </div>
    </div>
  );
}
