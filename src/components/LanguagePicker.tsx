import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, Icon } from 'rsuite';
import { locales } from '../i18n';

export default function LanguagePicker() {
  //Set Up translation hook
  const [t, i18n] = useTranslation();

  // Get the language from the browser.
  const langArr = i18n.language.split('-');
  const lang = langArr.length === 0 ? '?' : langArr[0].toUpperCase();

  return (
    <Fragment>
      <Dropdown
        icon={<Icon icon="globe" />}
        title={lang}
        onSelect={(key) => i18n.changeLanguage(key)}
        placement="bottomEnd"
      >
        {locales.map((lang, key) => (
          <Dropdown.Item key={key} eventKey={lang.key}>
            <b>{lang.key.toUpperCase()}</b> &middot; {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </Fragment>
  );
}
