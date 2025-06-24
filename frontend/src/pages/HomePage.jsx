import { Link } from 'react-router-dom';
import './HomePage.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* 🔝 Header */}
      <header className="top-header d-flex justify-content-between align-items-center px-4 py-3 text-white bg-dark">
        <h3 className="m-0 fw-bold">Welcome to GroceeJet 🛒</h3>
        <div>
          <Link to="/register" className="btn btn-outline-light me-2">Register</Link>
          <Link to="/login" className="btn btn-outline-light me-3">Login</Link>
          <button className="btn btn-light">🛒 Cart</button>
        </div>
      </header>

      {/* 🔍 Search & Location */}
      <div className="search-location-bar d-flex justify-content-between align-items-center px-4 py-3 bg-light border-bottom">
        <input
          type="text"
          placeholder="Search for groceries, restaurants..."
          className="form-control w-75 me-3"
        />
        <span className="fw-bold">📍 Bhaderwah</span>
      </div>

      {/* 🏷️ Categories */}
      <div className="category-bar d-flex overflow-auto bg-white px-3 py-2 border-bottom">
        {['All', 'Cafe', 'Home', 'Toys', 'Fresh', 'Electronics', 'Mobiles', 'Beauty', 'Fashion'].map((cat, idx) => (
          <button key={idx} className="btn btn-outline-secondary btn-sm me-2">{cat}</button>
        ))}
      </div>

      {/* 📸 Promo Slider */}
      <div className="promo-slider d-flex overflow-auto py-4 px-3">
        {[
          '/assets/momos.jpg',
          '/assets/taccos.jpg',
          '/assets/potato.jpg',
          '/assets/panner.jpg',
          '/assets/french.jpg'
        ].map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`promo-${idx}`}
            className="me-3 rounded shadow-sm"
            style={{ width: 320, height: 160, objectFit: 'cover' }}
          />
        ))}
      </div>

      {/* 🍽️ Top Restaurants */}
      <section className="px-4">
        <h4 className="fw-bold mb-3">Top restaurant chains in Bhaderwah</h4>
        <div className="d-flex overflow-auto pb-4">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="card me-3" style={{ width: '250px' }}>
              <img
                src="/assets/potato.jpg"
                className="card-img-top"
                alt="KFC"
              />
              <div className="card-body">
                <p className="text-muted small mb-1">ITEMS AT ₹59</p>
                <h5 className="card-title">Flavours</h5>
                <p className="card-text">4.2 • 20-25 mins<br />Burgers, Fast Food, Wraps<br />Seri Bazar Bhaderwah</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🍜 Restaurant Grid */}
      <section className="px-4 mt-5">
        <div className="row">
          {[...Array(12)].map((_, idx) => (
            <div key={idx} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="/assets/resturant.jpeg"
                  className="card-img-top"
                  alt={`Restaurant ${idx + 1}`}
                />
                <div className="card-body">
                  <h6 className="card-title">Restaurant #{idx + 1}</h6>
                  <p className="card-text small text-muted">⭐ 4.0 • Fast Delivery</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📱 App Download */}
      <section className="bg-light text-center py-5 mt-4 border-top">
        <h5>For better experience, download the GroceeJet app now</h5>
        <div className="mt-3">
          <button className="btn btn-success me-2">Download Android App</button>
          <button className="btn btn-primary">Download iOS App</button>
        </div>
      </section>

      {/* 🦶 Footer */}
      <footer className="footer bg-dark text-white pt-5 pb-3 mt-4 px-4">
        <div className="d-flex justify-content-between flex-wrap mb-4">
          <h4>GroceeJet</h4>
          <div>
            <span className="me-3">India</span>
            <span>English</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <h6>About GroceeJet</h6>
            <ul className="list-unstyled small">
              <li>Who We Are</li>
              <li>Blog</li>
              <li>Work With Us</li>
              <li>Investor Relations</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>GroceeVerse</h6>
            <ul className="list-unstyled small">
              <li>Blinkit</li>
              <li>Feeding India</li>
              <li>Hyperpure</li>
              <li>GroceeLand</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Learn More</h6>
            <ul className="list-unstyled small">
              <li>Privacy</li>
              <li>Security</li>
              <li>Terms</li>
              <li>Report Fraud</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Social Links</h6>
            <div className="d-flex gap-2">
              <img src="/assets/fb.png" alt="Facebook" style={{ width: '24px' }} />
              <img src="/assets/ig.png" alt="Instagram" style={{ width: '24px' }} />
            </div>
          </div>
        </div>
        <p className="small mt-4 mb-0">
          By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies.
        </p>
        <p className="small mb-0">© 2008–{new Date().getFullYear()} GroceeJet™ Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
