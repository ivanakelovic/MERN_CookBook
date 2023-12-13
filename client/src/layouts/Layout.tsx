import React,{useState,useRef} from "react";
import { Link,useNavigate } from "react-router-dom";
import { Navbar,Nav,Container,Overlay,Popover,OverlayTrigger } from "react-bootstrap";
import { FaHome, FaUtensils, FaList, FaUser } from 'react-icons/fa';
import {SiCodechef} from 'react-icons/si';
import {TbChefHat} from 'react-icons/tb';
import {PiCookingPotBold} from 'react-icons/pi';
import {TbCookieMan} from 'react-icons/tb';
import {GiFruitBowl} from 'react-icons/gi';
import {HiOutlineHeart} from 'react-icons/hi';
import { MdOutlineCategory } from "react-icons/md";
import { CiApple } from "react-icons/ci";
import { GiMeepleGroup } from "react-icons/gi";
import { LuLogOut } from "react-icons/lu";
import {GrFavorite} from 'react-icons/gr';
import logo from "../logo/cookE_logo.png";
import { useAuth } from "../auth";
import "../css/components.css";

const Layout=()=>{

    const handleLogout = () => {
        logout(); 
    };

    const {currentUser,logout}=useAuth();

    const [showFavorites,setShowFavorites]=useState(false);
    const targetRef=useRef(null);

    const handleFavoritesHover=()=>{
        setShowFavorites(!showFavorites);
    };



    const handleFavoritesClick = () => {
        setShowFavorites(false); 
      };

    const favoritesPopover=(
        <Popover id="favorites-popover">
            <Popover.Header as="h3">Favorites</Popover.Header>
            <Popover.Body>

            </Popover.Body>

        </Popover>
    )

    return(
        <>
            <Navbar collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
                <Container>
                <Navbar.Brand href='/dashboard' className="d-flex align-items-center">
            <img src={logo} alt="logo" />
            <span className="ml-2">cookE</span>
          </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav>
                          
                        <Nav.Link href='/add-recipe' className="d-flex align-items-center">
                        <TbChefHat/>
                                Add Recipe
                            </Nav.Link>
                            
                            <Nav.Link href='/recipes' className="d-flex align-items-center">
                                <PiCookingPotBold/>
                                Recipes
                            </Nav.Link>
                            

                            <Nav.Link href='/ingredients' className="d-flex align-items-center">
                            <GiFruitBowl/>
                                Ingredients
                            </Nav.Link>

                            <Nav.Link href='/categories' className="d-flex align-items-center">
                            <GiMeepleGroup/>
                                Categories
                            </Nav.Link>

                           {currentUser?(
                             <Nav.Link href='/my-profile' className="d-flex align-items-center">
                             <TbCookieMan/>
                             My Account                    
                               </Nav.Link>
                           ):( <Nav.Link href='/auth/registration' className="d-flex align-items-center">
                           <TbCookieMan/>
                            Sign Up                   
                             </Nav.Link>)}

                              {currentUser && currentUser.role === 'admin' ? (
                               <Nav>
                                 <Nav.Link href="/add-meal-category" className="d-flex align-items-center">
                                     <MdOutlineCategory/>
                                     Add Category
                                 </Nav.Link>
                                 <Nav.Link href="/add-ingredient" className="d-flex align-items-center">
                                    <CiApple/>
                                    Add Ingredient
                                 </Nav.Link>
                                </Nav>
                                ) 

                                : null}

                                {currentUser&&(
                                     <Nav.Link href="/favorites" className="d-flex align-items-center">
                                     <HiOutlineHeart  onMouseEnter={handleFavoritesHover} onMouseLeave={handleFavoritesHover}/>
                                        Favorites
                                     </Nav.Link>
                                )}
                        </Nav>

                        {currentUser?(
                            <Nav className="">
                                 <Nav.Link  onClick={handleLogout} className="d-flex align-items-center">
                                  <LuLogOut/>
                                    Logout
                                </Nav.Link>
                            </Nav>
                        ):null}

                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Overlay
                show={showFavorites}
                target={targetRef.current}
                placement="bottom"
            >
                {favoritesPopover}
            </Overlay>
        </>
    );
};

export default Layout;