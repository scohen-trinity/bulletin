"use strict"

console.log("Running react successfully")

const ce = React.createElement

const csrfToken           = document.getElementById("csrfToken").value;
const loginRoute          = document.getElementById("loginRoute").value;
const landingRoute        = document.getElementById("landingRoute").value;
const validateRoute       = document.getElementById("validateRoute").value;
const creationPageRoute   = document.getElementById("creationPageRoute").value;
const creationActionRoute = document.getElementById("creationActionRoute").value;
const searchExerciseRoute = document.getElementById("searchExerciseRoute").value;
const getUserInfo         = document.getElementById("getUserInfoRoute").value;
const getWorkouts         = document.getElementById("getWorkoutsRoute").value;

// Hamburger Component
class Hamburger extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.goToLogin = this.goToLogin.bind(this);
        this.goToLanding = this.goToLanding.bind(this);
    }

    closeMenu() {
        this.setState({ isOpen: false });
    }

    // Call this method after navigation actions
    goToLanding(e) {
        e.preventDefault();
        this.closeMenu();
        console.log("Go to landing page");
        window.location.href = landingRoute;
    }

    goToLogin(e) {
        e.preventDefault();
        this.closeMenu();
        console.log("Go to log in page");
        window.location.href = loginRoute;
    }

    toggleMenu() {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }

    render() {
        const navbarProps = {
            className: 'hamburger-navbar',
            onClick: this.toggleMenu 
        };

        const hamburgerProps = {
            className: `hamburger ${this.state.isOpen ? 'open' : ''}`
        };

        const burgerProps = index => ({
            key: index,
            className: `burger burger${index} ${this.state.isOpen ? 'open' : ''}`
        });

        return ce('div', navbarProps,
        ce('div', hamburgerProps,
            ce('div', burgerProps(1)), // First line of hamburger
            ce('div', burgerProps(2)), // Second line of hamburger
            ce('div', burgerProps(3))  // Third line of hamburger
        ),
        this.state.isOpen ? ce('div', { className: 'menu' },
        ce('a', { 
            onClick: e => this.goToLanding(e), 
            style: { cursor: 'pointer' }, 
            tabIndex: 0 
        }, "Home"),
        ce('a', { 
            onClick: e => this.goToLogin(e), 
            style: { cursor: 'pointer' }, 
            tabIndex: 0 
        }, "Login")
        ) : null
    );
    
    }

}

// Hamburger component above

class MainSearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true,
        }
    }

    render() {
        if(!this.state.loggedIn) {
            window.location.href = loginRoute;
            return null;
        } else {
            return ce('div', null, 
                ce(NavBarComponent, null, null),
                ce(BasicSearchComponent, null, null)
            );
        }
    }
}

class BasicSearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            workouts: []
        }
    }

    componentDidMount() {
        this.getInfo()
        console.log(this.state.username)
    }

    render() {
        return ce('div', {className: "form-container"},
            ce('h2', {className: "login-header"}, "hi " + this.state.username), 
            ce('input', {placeholder: "search for a workout"}, null),
            ce('div', null, 
                ce('ul', {id: "workout_list"}, null)
            )
            );
    }

    getInfo() {
        fetch(getUserInfo)
            .then(response => response.json())
            .then(userData => {
                this.setState({ username: userData });
                this.getWorkoutsForPage();
                console.log(userData)
            })
            .catch(error => {
                console.error('Error', error);
            })
    }

    getWorkoutsForPage() {
        fetch(getWorkouts, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Csrf-Token': csrfToken
            },
            body: JSON.stringify(this.state.username)
        })
        .then(response => response.json())
        .then(workouts => {
            const workout_list = document.getElementById('workout_list');
            workout_list.innerHTML = '';
            workouts.forEach(workout => {
                var listItem = document.createElement('li');

                if(Array.isArray(workout)) {
                    const workoutText = workout.join(', ');

                    listItem.textContent = workoutText;
                }
                workout_list.appendChild(listItem);
            });

            this.setState({ workouts: workouts });
            console.log(this.state.workouts);
        })
        .catch(error => {
            console.error('Error', error);
        })
    }
}

class NavBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return ce('div', {className: "navbar"},
           ce(Hamburger, {className: "hamburger-navbar"}, null),
           ce('h1', {className: "navbar-header", onClick: e => this.goToLanding(e)}, 'TIGER FIT'),
           ce('div', {className: "navbar-login-div", onClick: e => this.goToLogin(e)}, 
            ce('h2', {className: "navbar-header"}, 'LOGIN'),
            ce('img', { src: "https://cdn4.iconfinder.com/data/icons/man-user-human-person-business-profile-avatar/100/20-1User_13-512.png", className: "login-navbar"}, null) 
           ),
           
        )
    }

    goToLogin(e) {
        console.log("Go to log in page")
        window.location.href = loginRoute;
    }

    goToLanding(e) {
        console.log("Go to landing page")
        window.location.href = landingRoute;
    }
}

ReactDOM.render(
    ce(MainSearchComponent, null, null),
    document.getElementById('search_exercise_page')
);