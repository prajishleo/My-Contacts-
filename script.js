// Contact Class
class Contact {
	constructor(name, phone, email) {
		this.name = name;
		this.phone = phone;
		this.email = email;
	}
}

// UI Class
class UI {
	static displayContacts() {
		const StoredContact = Storage.getcontacts();
		const contacts = StoredContact;

		contacts.forEach((contact) => UI.addContact(contact));
	}

	static addContact(contact) {
		const list = document.querySelector('#contact-list');
		const row = document.createElement('tr');
		row.innerHTML = `
        <td>${contact.name}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

		list.appendChild(row);
	}

	static deleteContact(element) {
		if (element.classList.contains('delete')) {
			element.parentElement.parentElement.remove();
		}
	}

	static showAlert(message, className) {
		const div = document.createElement('div'); // Create div to display the alert
		div.className = `alert alert-${className}`; // Assign class name to the div
		div.appendChild(document.createTextNode(message)); // Adding the div to display the message
		const container = document.querySelector('.container'); // Decide where to display the alert
		const form = document.querySelector('#contact-form');
		container.insertBefore(div, form);

		// Remove alert after 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}
}
// Storage Class
class Storage {
	static getcontacts() {
		let contacts;
		if (localStorage.getItem('contacts') === null) {
			contacts = [];
		} else {
			contacts = JSON.parse(localStorage.getItem('contacts')); // JSON.parse for converting the array to objects
		}

		return contacts;
	}

	static addcontact(contact) {
		// Get contacts from local storage
		const contacts = Storage.getcontacts();
		contacts.push(contact);

		// Store the contact in local storage
		localStorage.setItem('contacts', JSON.stringify(contacts));
	}

	static deletecontact(phone) {
		const contacts = Storage.getcontacts();

		// Looping through to find the contact to remove.
		contacts.forEach((contact, index) => {
			if (contact.phone === phone) {
				contacts.splice(index, 1);
			}
		});

		// Store in local storage
		localStorage.setItem('contacts', JSON.stringify(contacts));
	}
}

// Display Contact Event
document.addEventListener('DOMContentLoaded', UI.displayContacts);

// Add Book Event
document.querySelector('#contact-form').addEventListener('submit', (e) => {
	// Prevent Default to display submitted datas
	e.preventDefault();

	// Get form values
	const name = document.querySelector('#name').value;
	const phone = document.querySelector('#phone').value;
	const mail = document.querySelector('#mail').value;

	// Validating the form
	if (name === '' || phone === '' || mail === '') {
		UI.showAlert('Please fill in all fields', 'danger');
	} else {
		// Instantiate the Contact
		const contact = new Contact(name, phone, mail);

		// Add Contact to UI
		UI.addContact(contact);

		// Add Contact to Local Storage
		Storage.addcontact(contact);

		// Displaying alert
		UI.showAlert('Contact Added', 'success');

		// Clear form fields after submitting
		document.querySelector('#name').value = '';
		document.querySelector('#phone').value = '';
		document.querySelector('#mail').value = '';
	}
});

// Remove Book Event
document.querySelector('#contact-list').addEventListener('click', (e) => {
	// Delete COntact from UI
	UI.deleteContact(e.target);

	// Delete Contact from Local Storage
	Storage.deletecontact(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
	// parentElement-<td>
	// previousElementSibling.previousElementSibling - points to <td> of phone
	// textContent - phone number

	// Display removed message
	UI.showAlert('Contact removed', 'primary');
});
