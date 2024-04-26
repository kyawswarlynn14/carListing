import Cookies from 'js-cookie';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const userFromCookies = Cookies.get('user');
    const user = userFromCookies ? JSON.parse(userFromCookies) : null;

    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate('/app')
        } else {
            navigate('/auth/login')
        }
    }, [user])

    return null;
}

export default IndexPage