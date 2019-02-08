<?php

namespace Drupal\openy_upgrade_tool\EventSubscriber;

use Drupal\Core\Config\ConfigCrudEvent;
use Drupal\Core\Config\ConfigEvents;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\openy_upgrade_tool\OpenyUpgradeLogManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Class ConfigEventSubscriber.
 *
 * @package Drupal\openy_upgrade_tool
 */
class ConfigEventSubscriber implements EventSubscriberInterface {

  use StringTranslationTrait;

  /**
   * The OpenyUpgradeLogManager.
   *
   * @var \Drupal\openy_upgrade_tool\OpenyUpgradeLogManagerInterface
   */
  protected $upgradeLogManager;

  /**
   * Logger channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $logger;

  /**
   * ConfigEventSubscriber constructor.
   *
   * @param \Drupal\openy_upgrade_tool\OpenyUpgradeLogManagerInterface $upgrade_log_manager
   *   OpenyUpgradeLog Manager.
   * @param \Drupal\Core\Logger\LoggerChannelInterface $loggerChannel
   *   Logger channel.
   */
  public function __construct(
    OpenyUpgradeLogManagerInterface $upgrade_log_manager,
    LoggerChannelInterface $loggerChannel) {

    $this->logger = $loggerChannel;
    $this->upgradeLogManager = $upgrade_log_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[ConfigEvents::SAVE][] = array('onSavingConfig', 800);
    return $events;
  }

  /**
   * Subscriber Callback for the event.
   *
   * @param \Drupal\Core\Config\ConfigCrudEvent $event
   *   Configuration save event.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  public function onSavingConfig(ConfigCrudEvent $event) {
    global $_openy_config_import_event;
    $config = $event->getConfig();
    $original = $config->getOriginal();
    if (empty($original)) {
      // Skip new config.
      return;
    }
    $updated = $config->get();

    if ($original == $updated) {
      // Skip config without updates.
      return;
    }
    $config_name = $config->getName();
    $openy_configs = $this->upgradeLogManager->getOpenyConfigList();
    if (!in_array($config_name, $openy_configs)) {
      // Skip configs not related to Open Y.
      return;
    }
    if (!$_openy_config_import_event) {
      // This config was updated outside Open Y profile.
      $this->upgradeLogManager->saveLoggerEntity($config_name, $updated);
      $this->logger->warning($this->t('You have manual updated @name config from Open Y profile.', ['@name' => $config_name]));
    }
    else {
      // Check if exist logger entity and enabled force mode.
      if ($this->upgradeLogManager->isForceMode() && $this->upgradeLogManager->isManuallyChanged($config_name, FALSE)) {
        $this->upgradeLogManager->createBackup($config_name);
      }
      $this->logger->info($this->t('Open Y has upgraded @name config.', ['@name' => $config_name]));
    }
  }

}
