import { useState, useEffect } from 'react';

import { userService } from 'services';

export default Home;

function Home() {
    useEffect(() => {

    }, []);
    return (
        <div className="card mt-4">
            <h4 className="card-header">Hi, {userService.userValue.name}</h4>
            <div className="card-body">
            </div>
        </div>
    );
}
