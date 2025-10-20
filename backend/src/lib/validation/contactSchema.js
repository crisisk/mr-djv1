const { checkSchema } = require('express-validator');

const SPAM_KEYWORDS = [
  'viagra',
  'cialis',
  'loan',
  'credit repair',
  'betting',
  'casino',
  'gambling',
  'forex',
  'crypto',
  'bitcoin',
  'seo',
  'backlink',
  'marketing services',
  'porn',
  'escort'
];

function containsSpamKeyword(value = '') {
  const lowerCased = value.toLowerCase();
  return SPAM_KEYWORDS.some((keyword) => lowerCased.includes(keyword));
}

function containsLink(value = '') {
  return /(https?:\/\/|www\.)\S+/i.test(value);
}

function containsHtml(value = '') {
  return /<[^>]+>/.test(value);
}

function hasLongRepeatingSequence(value = '') {
  return /(.)\1{6,}/.test(value);
}

function rejectIfSpammy(value, fieldLabel) {
  if (!value) {
    return true;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return true;
  }

  if (containsHtml(normalized)) {
    throw new Error(`${fieldLabel} mag geen HTML bevatten`);
  }

  if (containsLink(normalized)) {
    throw new Error(`${fieldLabel} mag geen links bevatten`);
  }

  if (containsSpamKeyword(normalized)) {
    throw new Error(`${fieldLabel} lijkt spam te bevatten`);
  }

  if (hasLongRepeatingSequence(normalized)) {
    throw new Error(`${fieldLabel} bevat een verdacht patroon`);
  }

  return true;
}

const contactSchema = checkSchema({
  name: {
    in: ['body'],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: 'Naam is vereist'
    },
    isLength: {
      options: { max: 255 },
      bail: true,
      errorMessage: 'Naam is te lang'
    },
    custom: {
      options: (value) => rejectIfSpammy(value, 'Naam')
    }
  },
  email: {
    in: ['body'],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: 'E-mailadres is vereist'
    },
    isEmail: {
      bail: true,
      errorMessage: 'Ongeldig e-mailadres'
    },
    normalizeEmail: true
  },
  phone: {
    in: ['body'],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: 'Telefoonnummer is vereist'
    },
    matches: {
      options: [/^[0-9+()\s-]{6,20}$/],
      errorMessage: 'Telefoonnummer is ongeldig',
      bail: true
    }
  },
  message: {
    in: ['body'],
    optional: { options: { nullable: true } },
    trim: true,
    isLength: {
      options: { max: 2000 },
      bail: true,
      errorMessage: 'Bericht is te lang'
    },
    custom: {
      options: (value) => rejectIfSpammy(value, 'Bericht')
    }
  },
  eventType: {
    in: ['body'],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: 'Type evenement is vereist'
    },
    isLength: {
      options: { max: 255 },
      bail: true,
      errorMessage: 'Type evenement is te lang'
    },
    custom: {
      options: (value) => rejectIfSpammy(value, 'Type evenement')
    }
  },
  eventDate: {
    in: ['body'],
    optional: { options: { nullable: true } },
    trim: true,
    isISO8601: {
      errorMessage: 'Ongeldige datum'
    }
  },
  packageId: {
    in: ['body'],
    optional: { options: { nullable: true } },
    trim: true,
    isLength: {
      options: { max: 100 },
      errorMessage: 'Pakket-ID is ongeldig'
    },
    custom: {
      options: (value) => rejectIfSpammy(value, 'Pakket-ID')
    }
  }
});

module.exports = contactSchema;
module.exports.__TESTING__ = {
  containsSpamKeyword,
  containsLink,
  containsHtml,
  hasLongRepeatingSequence,
  rejectIfSpammy
};
