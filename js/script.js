// Burger
let menuBtn = document.querySelector('.menu-btn');
let menu = document.querySelector('.menu');

menuBtn.addEventListener('click', function(){
	menuBtn.classList.toggle('active');
	menu.classList.toggle('active');
})

// REDUCE image size _________________________________________________________________
async function resizeImage(file, maxSizeInKB, maxWidth) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                
                const maxFileSize = maxSizeInKB * 1024;
                let quality = 1;
                let resizedDataUrl;

                const compressImage = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, width, height);
                    resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    quality -= 0.1;
                    return resizedDataUrl.length <= maxFileSize;
                };

                // Compress the image until it meets the size limit
                let isCompressed = compressImage();
                while (!isCompressed && quality > 0) {
                    isCompressed = compressImage();
                }

                if (!isCompressed) {
                    reject(new Error('Cannot resize image below the specified size.'));
                    return;
                }

                fetch(resizedDataUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    })
                    .catch(reject);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


// MailJS Part _______________________________________________________________________
document.getElementById('multiStepForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendEmail();
});

// Here is first we download to imgBB.com, and have back url with photo
async function uploadImage(imageFile) {
    const apiKey = '64268e112b3233e2c5fd8233252c1a65';
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload image: ' + response.statusText);
    }

    const data = await response.json();
    if (!data || !data.data || !data.data.url) {
        throw new Error('Invalid response from image upload service');
    }

    return data.data.url;
}

// Sending MailJS code.
async function sendEmail() {
    const form = document.getElementById('multiStepForm');
    const formData = new FormData(form);
    const formObj = {};

    const imageFile = formData.get('uploadPhotos');
    let imageUrl = '';

    if (imageFile) {
        try {
            const resizedImage = await resizeImage(imageFile, 45, 400); // Resize to 45KB and max width 400px
            imageUrl = await uploadImage(resizedImage);
            formObj['uploadPhotos'] = imageUrl;
        } catch (error) {
            console.error('Error resizing or uploading image:', error);
            alert('Failed to process the image.');
            return;
        }
    }

    formData.forEach((value, key) => {
        if (key !== 'uploadPhotos') {
            formObj[key] = value;
        }
    });

    emailjs.send('service_emailjs_dn', 'template_x0xmahc', formObj)
        .then(function(response) {
            alert('Your form has been sent!', response.status, response.text);
        }, function(error) {
            alert('Something went wrong...', error);
        });
}


// SCROLL Animation _____________________________________________________________________
// function onEntry(entry) {
//     entry.forEach(change => {
//       if (change.isIntersecting) {
//         change.target.classList.add('element-show');
//       }
//     });
//   }

//   let options = { threshold: [0.5] };
//   let observer = new IntersectionObserver(onEntry, options);
//   let elements = document.querySelectorAll('.scroll_animation');
//   for (let elm of elements) {
//     observer.observe(elm);
//   }

//   let options1 = { threshold: [0.5] };
//   let observer1 = new IntersectionObserver(onEntry, options1);
//   let elements1 = document.querySelectorAll('.scroll_animation_right');
//   for (let elm of elements1) {
//     observer1.observe(elm);
//   }

//   let options2 = { threshold: [0.5] };
//   let observer2 = new IntersectionObserver(onEntry, options2);
//   let elements2 = document.querySelectorAll('.scroll_animation_left');
//   for (let elm of elements2) {
//     observer2.observe(elm);
// }

// Accordion _____________________________________________________________________________
document.addEventListener('DOMContentLoaded', () => {
    const accordion = document.querySelector('.accordion');
    const firstItem = accordion.querySelector('.accordion_item:first-child');
    const firstContent = firstItem.querySelector('.accordion-content');
    const firstArrowImage = firstItem.querySelector('.accordion_item_img');
  
    // Set the first accordion item to be open by default
    firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    firstArrowImage.style.transform = 'rotate(180deg)';
  
    accordion.addEventListener('click', (event) => {
      const item = event.target.closest('.accordion_item');
      if (!item) return;
  
      const content = item.querySelector('.accordion-content');
      const arrowImage = item.querySelector('.accordion_item_img');
  
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        arrowImage.style.transform = 'rotate(0deg)';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        arrowImage.style.transform = 'rotate(180deg)';
      }
  
      const otherItems = Array.from(accordion.querySelectorAll('.accordion_item')).filter(
        (otherItem) => otherItem !== item
      );
  
      otherItems.forEach((otherItem) => {
        otherItem.querySelector('.accordion-content').style.maxHeight = null;
        otherItem.querySelector('.accordion_item_img').style.transform = 'rotate(0deg)';
      });
    });
  });
  