export function useUIControls() {
  const getElements = () => ({
    arrowSection: document.querySelector('.arrow'),
    ingeImage: document.getElementById('ingeImage'),
    busStopImage: document.getElementById('busStopImage'),
    busImage: document.getElementById('busImage'),
    cityHallImage: document.getElementById('cityHallImage'),
    cloudsImage: document.getElementById('cloudsImage'),
    mapIntro: document.querySelector('.pre-map-view'),
    groundElement: document.querySelector('.main')
  });

  const applyUIStyles = (range) => {
    const { arrowSection, ingeImage, busStopImage, busImage, cityHallImage, cloudsImage } = getElements();
    [arrowSection, busImage].forEach(img => {
      if (img) img.classList.add('visible');
    });
    if (ingeImage) ingeImage.classList.add('scrolled');
    if (busStopImage) {
      busStopImage.classList.add('scrolled', 'visible');
    }

    if (cityHallImage && cloudsImage) {
      const scaleFactorImg = Math.max(0.6, 1.0 - (range * 0.17));
      const cloudsTranslateY = Math.round(range * 40);
      const transformOrigin = 'bottom left';

      [cityHallImage, cloudsImage].forEach(img => {
        img.style.opacity = '1.0';
        img.style.transition = 'all 0.9s ease-in-out';
        img.style.transformOrigin = transformOrigin;
      });

      cityHallImage.style.transform = `scale(${scaleFactorImg})`;
      cloudsImage.style.transform = `scale(${scaleFactorImg}) translateY(${cloudsTranslateY}px)`;
    }
  };

  const resetUIStyles = () => {
    const { arrowSection, ingeImage, busStopImage, busImage, cityHallImage, cloudsImage, mapIntro } = getElements();
    [arrowSection, busImage].forEach(img => {
      if (img) img.classList.remove('visible');
    });
    [ingeImage, busStopImage].forEach(img => {
      if (img) img.classList.remove('scrolled');
    });

    if (cityHallImage && cloudsImage) {
      [cityHallImage, cloudsImage].forEach(img => {
        img.style.opacity = '0.5';
        img.style.transform = 'scale(1.0)';
        img.style.transformOrigin = 'bottom left';
        img.style.transition = 'all 0.9s ease-in-out';
      });
    }

    if (mapIntro) {
      mapIntro.style.opacity = '0';
      mapIntro.style.transition = 'opacity 0.5s ease-in-out';
    }
  };

  const showMainUI = (range, headerRangeRef, textRangeRef) => {
    if (textRangeRef?.value) {
      textRangeRef.value.showTextRange(range);
    }

    if (headerRangeRef?.value) {
      headerRangeRef.value.showHeaderRange(range);
    }

    applyUIStyles(range);
  };

  const hideMainUI = (headerRangeRef, textRangeRef) => {
    if (textRangeRef?.value) {
      textRangeRef.value.hideAllTextRanges();
    }

    resetUIStyles();
  };

  const initializeUI = () => {
    resetUIStyles();
  };

  const showMapImgUI = () => {
    const { busStopImage, busImage, ingeImage, cityHallImage, cloudsImage } = getElements();
    [cityHallImage, cloudsImage].forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease-in-out';
    });
    [busImage, busStopImage].forEach(img => {
      if (img) img.classList.remove('visible');
    });
    if (ingeImage) ingeImage.classList.remove('scrolled');
  }

  const mapUI = () => {
    const mapSection = document.querySelector('.map-scrollytelling');
    const mapSection2 = document.querySelector('.map-scrollytelling-2');
    const mapIntro = document.querySelector('.map-intro');
    const mapSections = [mapSection, mapSection2, mapIntro];
    mapSections.forEach(section => {
      if (section) {
        section.style.opacity = '1';
        section.style.transition = 'opacity 0.5s ease-in-out';
      }
    });
  }

  return {
    applyUIStyles,
    resetUIStyles,
    showMainUI,
    hideMainUI,
    initializeUI,
    showMapImgUI,
    mapUI
  };
}
